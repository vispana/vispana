mix deps.get

cd assets || echo "[ERROR] could not find directory 'assets'" && exit 1
npm install

cd ..
mix phx.server
