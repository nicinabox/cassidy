rm -rf build dist
mkdir dist

webpack -p
cp build/* public/* dist/

surge dist/ $SURGE_DOMAIN
