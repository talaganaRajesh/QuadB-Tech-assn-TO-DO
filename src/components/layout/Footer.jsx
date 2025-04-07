function Footer() {
  // Get current year for copyright
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">&copy; {currentYear} TaskMaster. Developed by Rajesh</p>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://talaganarajesh.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-emerald-600"
            >
              My Portfolio
            </a>
            <a
              href="https://github.com/talaganaRajesh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-emerald-600"
            >
              GitHub
            </a>
            <a
              href="mailto:talaganarajesh@gmail.com"
              className="text-sm text-gray-600 hover:text-emerald-600"
            >
              talaganarajesh@gmail.com
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer

