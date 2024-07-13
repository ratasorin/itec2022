npx nx run client:build;
aws s3 cp ./dist/apps/client s3://deskbooking --recursive;