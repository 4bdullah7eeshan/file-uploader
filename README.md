# File Uploader

## About

Cloud storage application enabling authenticated users to upload files and organize them into folders - stripped down version of Google Drive (or any other personal storage service).

<img src="./public/file-uploader.png" alt="File Uploader Home Page" width="400">

## Features

### Authentication

- Sign up
- Sign in
- Sign out

### Core

- Uploading files
- CRUDing folders
- Uploading files inside folders
- Nesting folders
- Edit and delete files

## Technologies

- Express
- Prisma
- PostgreSql
- Passport
- EJS

## Future Improvements

- Improve responsiveness across devices.
- Setup a demo account sign in.
- Add a share folder functionality through link with a customizable expiry duration.

## Getting Started

### Clone Repository

```
git clone https://github.com/4bdullah7eeshan/file-uploader.git
cd file-uploader
```

### Install Dependencies

```
npm install
```

### Set Up Environment Variables

```
DATABASE_URL="postgresql://<owner>:<db>?sslmode=require"
PORT=6123

CLOUDINARY_CLOUD_NAME=<>
CLOUDINARY_API_KEY=<>
CLOUDINARY_API_SECRET=<>
CLOUDINARY_URL=cloudinary://<>
```

## Background

This project was created as part of [The Odin Project](https://www.theodinproject.com/)'s [File Uploader](https://www.theodinproject.com/lessons/nodejs-file-uploader) project.





