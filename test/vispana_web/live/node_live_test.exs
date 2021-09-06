defmodule VispanaWeb.NodeLiveTest do
  use VispanaWeb.ConnCase

  import Phoenix.LiveViewTest

  alias Vispana.Cluster

  @create_attrs %{content: %{}, hostname: "some hostname", serviceTypes: []}
  @update_attrs %{content: %{}, hostname: "some updated hostname", serviceTypes: []}
  @invalid_attrs %{content: nil, hostname: nil, serviceTypes: nil}

  defp fixture(:node) do
    {:ok, node} = Cluster.create_node(@create_attrs)
    node
  end

  defp create_node(_) do
    node = fixture(:node)
    %{node: node}
  end

  describe "Index" do
    setup [:create_node]

    test "lists all nodes", %{conn: conn, node: node} do
      {:ok, _index_live, html} = live(conn, Routes.node_index_path(conn, :index))

      assert html =~ "Listing Nodes"
      assert html =~ node.hostname
    end

    test "saves new node", %{conn: conn} do
      {:ok, index_live, _html} = live(conn, Routes.node_index_path(conn, :index))

      assert index_live |> element("a", "New Node") |> render_click() =~
               "New Node"

      assert_patch(index_live, Routes.node_index_path(conn, :new))

      assert index_live
             |> form("#node-form", node: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      {:ok, _, html} =
        index_live
        |> form("#node-form", node: @create_attrs)
        |> render_submit()
        |> follow_redirect(conn, Routes.node_index_path(conn, :index))

      assert html =~ "Node created successfully"
      assert html =~ "some hostname"
    end

    test "updates node in listing", %{conn: conn, node: node} do
      {:ok, index_live, _html} = live(conn, Routes.node_index_path(conn, :index))

      assert index_live |> element("#node-#{node.id} a", "Edit") |> render_click() =~
               "Edit Node"

      assert_patch(index_live, Routes.node_index_path(conn, :edit, node))

      assert index_live
             |> form("#node-form", node: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      {:ok, _, html} =
        index_live
        |> form("#node-form", node: @update_attrs)
        |> render_submit()
        |> follow_redirect(conn, Routes.node_index_path(conn, :index))

      assert html =~ "Node updated successfully"
      assert html =~ "some updated hostname"
    end

    test "deletes node in listing", %{conn: conn, node: node} do
      {:ok, index_live, _html} = live(conn, Routes.node_index_path(conn, :index))

      assert index_live |> element("#node-#{node.id} a", "Delete") |> render_click()
      refute has_element?(index_live, "#node-#{node.id}")
    end
  end

  describe "Show" do
    setup [:create_node]

    test "displays node", %{conn: conn, node: node} do
      {:ok, _show_live, html} = live(conn, Routes.node_show_path(conn, :show, node))

      assert html =~ "Show Node"
      assert html =~ node.hostname
    end

    test "updates node within modal", %{conn: conn, node: node} do
      {:ok, show_live, _html} = live(conn, Routes.node_show_path(conn, :show, node))

      assert show_live |> element("a", "Edit") |> render_click() =~
               "Edit Node"

      assert_patch(show_live, Routes.node_show_path(conn, :edit, node))

      assert show_live
             |> form("#node-form", node: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      {:ok, _, html} =
        show_live
        |> form("#node-form", node: @update_attrs)
        |> render_submit()
        |> follow_redirect(conn, Routes.node_show_path(conn, :show, node))

      assert html =~ "Node updated successfully"
      assert html =~ "some updated hostname"
    end
  end
end
