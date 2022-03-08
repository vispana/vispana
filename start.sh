#!/bin/bash

mix deps.get
npm install --prefix ./assets
mix phx.server
