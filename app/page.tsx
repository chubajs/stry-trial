import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_auto] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to StoryTelling</h1>
        <p className="text-xl mb-8">Unleash your creativity and craft amazing stories</p>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="#"
            // Replace '#' with the actual link to start creating stories
          >
            Start Creating
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://t.me/sergiobulaev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join our Telegram
          </a>
        </div>
      </main>
      
      <footer className="text-center py-4">
        <p>&copy; {new Date().getFullYear()} Sergey Bulaev. All rights reserved.</p>
        <a
          className="text-sm text-gray-600 hover:underline"
          href="https://t.me/sergiobulaev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow me on Telegram
        </a>
      </footer>
    </div>
  );
}
