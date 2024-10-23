import List from "@/components/List";
import ShoppingSpot from "@/components/pull-up";

export default function Home() {
  return (
    <div>
      <main className="bg-white h-screen items-center flex flex-col pt-20">
        <List />
      </main>
      <div>
        <ShoppingSpot/> 
      </div>
    </div>
    
    
  );
}
