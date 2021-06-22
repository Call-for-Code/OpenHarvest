#!/bin/bash
cd frontend
npm i
npm run build
cd ..
rm -rf backend/public/
mv frontend/dist/ backend/public