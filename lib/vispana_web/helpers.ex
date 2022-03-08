defmodule VispanaWeb.Helpers do

  use Number

  def format_number(value) do
    Number.Delimit.number_to_delimited(value, delimiter: ".", separator: ",", precision: 0)
  end

end
