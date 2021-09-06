defmodule Vispana.ClusterTest do
  use Vispana.DataCase

  alias Vispana.Cluster

  describe "nodes" do
    alias Vispana.Cluster.Node

    @valid_attrs %{content: %{}, hostname: "some hostname", serviceTypes: []}
    @update_attrs %{content: %{}, hostname: "some updated hostname", serviceTypes: []}
    @invalid_attrs %{content: nil, hostname: nil, serviceTypes: nil}

    def node_fixture(attrs \\ %{}) do
      {:ok, node} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Cluster.create_node()

      node
    end

    test "list_nodes/0 returns all nodes" do
      node = node_fixture()
      assert Cluster.list_nodes() == [node]
    end

    test "get_node!/1 returns the node with given id" do
      node = node_fixture()
      assert Cluster.get_node!(node.id) == node
    end

    test "create_node/1 with valid data creates a node" do
      assert {:ok, %Node{} = node} = Cluster.create_node(@valid_attrs)
      assert node.content == %{}
      assert node.hostname == "some hostname"
      assert node.serviceTypes == []
    end

    test "create_node/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Cluster.create_node(@invalid_attrs)
    end

    test "update_node/2 with valid data updates the node" do
      node = node_fixture()
      assert {:ok, %Node{} = node} = Cluster.update_node(node, @update_attrs)
      assert node.content == %{}
      assert node.hostname == "some updated hostname"
      assert node.serviceTypes == []
    end

    test "update_node/2 with invalid data returns error changeset" do
      node = node_fixture()
      assert {:error, %Ecto.Changeset{}} = Cluster.update_node(node, @invalid_attrs)
      assert node == Cluster.get_node!(node.id)
    end

    test "delete_node/1 deletes the node" do
      node = node_fixture()
      assert {:ok, %Node{}} = Cluster.delete_node(node)
      assert_raise Ecto.NoResultsError, fn -> Cluster.get_node!(node.id) end
    end

    test "change_node/1 returns a node changeset" do
      node = node_fixture()
      assert %Ecto.Changeset{} = Cluster.change_node(node)
    end
  end
end
