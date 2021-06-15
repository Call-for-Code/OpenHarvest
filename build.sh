#!/bin/bash
cd carbon-frontend
npm i
npm run build
cd ..
rm -rf backend/public/
mv carbon-frontend/dist/ backend/public