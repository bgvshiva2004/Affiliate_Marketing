import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ['latin'],
  weight:"400",
})

const Footer = () => (
    <footer className={`w-full text-center p-2 text-sm text-white ${poppins.className}`} style={{ background: "linear-gradient(135deg, #027cc4, #3596d0)" }}>
      <div className="flex justify-center space-x-4">
        <a href="/terms" className="hover:underline">Conditions of Use</a>  
        <a href="/ads" className="hover:underline">Interest-Based Ads</a>
      </div>
      <p className="mt-1">© {new Date().getFullYear()} OuraGen</p>
    </footer>
  );
  
  export default Footer;
  