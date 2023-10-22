#!/bin/bash
export NODE_OPTIONS=--openssl-legacy-provider
mix deps.get
npm install --prefix ./assets
mix phx.server
