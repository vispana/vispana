package com.vispana.vespa.state.helpers;

import static com.vispana.vespa.state.helpers.Request.requestGetWithDefaultValue;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.*;
import java.net.URI;
import java.net.http.*;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.jar.JarEntry;
import java.util.jar.JarInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JavaComponentsFilesystem {

  private static final Logger logger = LoggerFactory.getLogger(JavaComponentsFilesystem.class);

  // Filesystem node representing a file or directory
  public static class FilesystemNode {
    private final String name;
    private final String path;
    private final boolean isFile;
    private final String content;
    private final Map<String, FilesystemNode> children;

    @JsonCreator
    public FilesystemNode(
        @JsonProperty("name") String name,
        @JsonProperty("path") String path,
        @JsonProperty("isFile") boolean isFile,
        @JsonProperty("content") String content,
        @JsonProperty("children") Map<String, FilesystemNode> children) {
      this.name = name;
      this.path = path;
      this.isFile = isFile;
      this.content = content;
      this.children = children != null ? children : new HashMap<>();
    }

    // Getters
    public String getName() {
      return name;
    }

    public String getPath() {
      return path;
    }

    public boolean isFile() {
      return isFile;
    }

    public String getContent() {
      return content;
    }

    public Map<String, FilesystemNode> getChildren() {
      return children;
    }

    public void addChild(String name, FilesystemNode node) {
      children.put(name, node);
    }
  }

  // Main filesystem structure
  public static class Filesystem {
    private final String componentsJarName;
    private final FilesystemNode root;
    private final int totalFiles;

    @JsonCreator
    public Filesystem(
        @JsonProperty("componentsJarName") String componentsJarName,
        @JsonProperty("root") FilesystemNode root,
        @JsonProperty("totalFiles") int totalFiles) {
      this.componentsJarName = componentsJarName;
      this.root = root;
      this.totalFiles = totalFiles;
    }

    public String getComponentsJarName() {
      return componentsJarName;
    }

    public FilesystemNode getRoot() {
      return root;
    }

    public int getTotalFiles() {
      return totalFiles;
    }
  }

  /** Downloads JAR from endpoint and builds filesystem structure */
  public static Filesystem buildFilesystemFromJar(
      String componentsJarUrl, String componentsJarName) {
    logger.info("Building filesystem from JAR: {}", componentsJarUrl);

    try {
      // Download JAR file
      HttpClient client = HttpClient.newHttpClient();
      HttpRequest request = HttpRequest.newBuilder().uri(URI.create(componentsJarUrl)).build();
      HttpResponse<InputStream> response =
          client.send(request, HttpResponse.BodyHandlers.ofInputStream());

      if (response.statusCode() != 200) {
        logger.error("Failed to download JAR: HTTP {}", response.statusCode());
        return new Filesystem(componentsJarName, null, 0);
      }

      Map<String, String> fileContents = new HashMap<>();
      int totalFiles = 0;

      // Extract JAR contents
      try (JarInputStream jarStream = new JarInputStream(response.body())) {
        JarEntry entry;
        while ((entry = jarStream.getNextJarEntry()) != null) {
          if (!entry.isDirectory()) {
            String fileName = entry.getName();
            String content = readFileContent(jarStream, fileName);
            fileContents.put(fileName, content);
            totalFiles++;
            logger.info("Extracted file: {}", fileName);
          }
        }
      }

      // Build tree structure
      FilesystemNode root = buildTree(fileContents);

      logger.info("Successfully built filesystem with {} files", totalFiles);
      return new Filesystem(componentsJarName, root, totalFiles);

    } catch (Exception e) {
      logger.error("Error building filesystem from JAR", e);
      return new Filesystem(componentsJarName, null, 0);
    }
  }

  /** Reads content from JAR entry stream */
  private static String readFileContent(JarInputStream jarStream, String fileName) {
    try {
      // Only read text-based files to avoid binary content issues
      if (isTextFile(fileName)) {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] data = new byte[1024];
        int bytesRead;

        while ((bytesRead = jarStream.read(data, 0, data.length)) != -1) {
          buffer.write(data, 0, bytesRead);
        }

        return buffer.toString("UTF-8");
      } else if (fileName.endsWith(".class")) {
        // For .class files, return a placeholder indicating it's bytecode
        return "// Compiled Java class file (bytecode)\n// Original source not available\n// File: "
            + fileName
            + "\n// Use a Java decompiler to view source code";
      } else {
        return "// Binary file: " + fileName + "\n// Content not displayable as text";
      }
    } catch (Exception e) {
      logger.warn("Error reading file content for {}: {}", fileName, e.getMessage());
      return "// Error reading file content: " + e.getMessage();
    }
  }

  /** Determines if a file should be treated as text */
  private static boolean isTextFile(String fileName) {
    String lowerName = fileName.toLowerCase();
    return lowerName.endsWith(".java")
        || lowerName.endsWith(".xml")
        // || lowerName.endsWith(".class")
        || lowerName.endsWith(".def")
        || lowerName.endsWith(".properties")
        || lowerName.endsWith(".txt")
        || lowerName.endsWith(".md")
        || lowerName.endsWith(".json")
        || lowerName.endsWith(".yml")
        || lowerName.endsWith(".yaml")
        || lowerName.endsWith(".css")
        || lowerName.endsWith(".js")
        || lowerName.endsWith(".html")
        || lowerName.endsWith(".mf")
        || fileName.contains("MANIFEST");
  }

  /** Builds tree structure from flat file map */
  private static FilesystemNode buildTree(Map<String, String> fileContents) {
    Map<String, FilesystemNode> root_children = new HashMap<>();

    for (Map.Entry<String, String> entry : fileContents.entrySet()) {
      String filePath = entry.getKey();
      String content = entry.getValue();

      String[] pathParts = filePath.split("/");
      Map<String, FilesystemNode> currentLevel = root_children;

      // Navigate/create directory structure
      for (int i = 0; i < pathParts.length - 1; i++) {
        String dirName = pathParts[i];
        String dirPath = String.join("/", Arrays.copyOfRange(pathParts, 0, i + 1));

        if (!currentLevel.containsKey(dirName)) {
          FilesystemNode dirNode = new FilesystemNode(dirName, dirPath, false, null, null);
          currentLevel.put(dirName, dirNode);
        }
        currentLevel = currentLevel.get(dirName).getChildren();
      }

      // Add the file
      String fileName = pathParts[pathParts.length - 1];
      FilesystemNode fileNode = new FilesystemNode(fileName, filePath, true, content, null);
      currentLevel.put(fileName, fileNode);
    }

    FilesystemNode root = new FilesystemNode("root", "/", false, null, root_children);
    return root;
  }

  /** Helper method to get filesystem for a specific component JAR */
  public static String getComponentsJarName(String baseUrl) {
    String jarNamesUrl = baseUrl + "/content/components/";
    List<String> componentsJarNames =
        requestGetWithDefaultValue(jarNamesUrl, List.class, List.of());
    String componentJarName =
        componentsJarNames.get(0).substring(componentsJarNames.get(0).lastIndexOf('/') + 1);
    logger.info("Component JAR name: {}", componentJarName);
    return componentJarName;
  }

  /** Helper method to get filesystem for a specific component JAR */
  public static Filesystem getComponentFilesystem(String baseUrl) {
    String componentJarName = getComponentsJarName(baseUrl);
    String componentsJarUrl = baseUrl + "/content/components/" + componentJarName;
    return buildFilesystemFromJar(componentsJarUrl, componentJarName);
  }
}
