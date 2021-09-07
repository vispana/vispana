defmodule Vispana.Cluster do
  @moduledoc """
  The Cluster context.
  """

  import Ecto.Query, warn: false
  import Logger, warn: false
  alias Vispana.Repo

  alias Vispana.Cluster.Node

  @doc """
  Returns the list of nodes.

  ## Examples

      iex> list_nodes()
      [%Node{}, ...]

  """
  def list_nodes do
    { :ok, result } = fetch()

    services = result["clusters"]
       |> Enum.flat_map(&(&1["services"]))
#      |> Enum.find(fn(val) -> val["type"] == "hosts" end)


    services
      |> Enum.group_by(&get_key(&1), &get_service_type(&1))
      |> Enum.sort_by(fn {host, value} -> host end)
      |> Enum.with_index(1)
      |> Enum.map(fn {{host, value}, index} -> %Node{id: index, hostname: host, serviceTypes: value |> Enum.uniq |> Enum.sort } end)


  end

  def get_key(service) do
    service["host"]
  end

  def get_service_type(service) do
    service["serviceType"]
  end

  def fetch do
    case HTTPoison.get("http://gew1-searchvespaepisodeconfig-a-t7hp.gew1.spotify.net:19071/serviceview/v1") do
      {:ok, %{status_code: 200, body: body}} ->
        {:ok, Poison.decode!(body)}
      {:ok, %{status_code: 404}} ->
        {:error, :not_found}
      {:error, _err} ->
        {:error, :internal_server_error}
    end
  end

  @doc """
  Gets a single node.

  Raises `Ecto.NoResultsError` if the Node does not exist.

  ## Examples

      iex> get_node!(123)
      %Node{}

      iex> get_node!(456)
      ** (Ecto.NoResultsError)

  """
  def get_node!(id), do: Repo.get!(Node, id)

  @doc """
  Creates a node.

  ## Examples

      iex> create_node(%{field: value})
      {:ok, %Node{}}

      iex> create_node(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_node(attrs \\ %{}) do
    %Node{}
    |> Node.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a node.

  ## Examples

      iex> update_node(node, %{field: new_value})
      {:ok, %Node{}}

      iex> update_node(node, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_node(%Node{} = node, attrs) do
    node
    |> Node.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a node.

  ## Examples

      iex> delete_node(node)
      {:ok, %Node{}}

      iex> delete_node(node)
      {:error, %Ecto.Changeset{}}

  """
  def delete_node(%Node{} = node) do
    Repo.delete(node)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking node changes.

  ## Examples

      iex> change_node(node)
      %Ecto.Changeset{data: %Node{}}

  """
  def change_node(%Node{} = node, attrs \\ %{}) do
    Node.changeset(node, attrs)
  end
end
