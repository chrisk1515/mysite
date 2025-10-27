cd C:\Users\chris\dev\mysite
$env:NODE_ENV="production"
npm run migrate:deploy
npm run build:web
npm run start:web
