# SMK Negeri 2 Depok Sleman Links

A dynamic links website for SMK Negeri 2 Depok Sleman (STEMBAYO), featuring customizable social media and website links. Admins can log in to manage links and icons, with images uploaded via ImageKit and data stored in MongoDB.

## Features

- Public page with categorized links and social media.
- Admin login and registration.
- Config page for managing, sorting, adding, editing, and deleting links/socials.
- Custom icon/image upload via ImageKit.
- Data stored in MongoDB.
- Responsive UI with drag-and-drop sorting.

## Tech Stack

- Next.js (React)
- MongoDB (via Mongoose)
- ImageKit (image upload)
- Tailwind CSS
- JWT authentication

## Getting Started

1. Clone the repo:

   ```sh
   git clone https://github.com/KARYASIJA/links-stembayo.git
   cd links-stembayo
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Configure environment variables:

   - Copy `.env.example` to `.env` and fill in your MongoDB and ImageKit credentials.

4. Run the development server:

   ```sh
   npm run dev
   ```

5. Access the site at `http://localhost:3000`.

## Usage

- Visit `/` for the public links page.
- Admins: Register/login at `/login` or `/register`.
- After login, access `/config` to manage links and social media.

## License

MIT
