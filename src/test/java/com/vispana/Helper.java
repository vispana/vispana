package com.vispana;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.apache.commons.io.FileUtils;

public class Helper {

  public static String defaultHostsXmlString() {
    ClassLoader loader = Helper.class.getClassLoader();
    File file = new File(loader.getResource("xml/hosts.xml").getFile());
    try {
      return FileUtils.readFileToString(file, StandardCharsets.UTF_8);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  public static String defaultServicesXmlString() {
    ClassLoader loader = Helper.class.getClassLoader();
    File file = new File(loader.getResource("xml/services.xml").getFile());
    try {
      return FileUtils.readFileToString(file, StandardCharsets.UTF_8);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }
}
