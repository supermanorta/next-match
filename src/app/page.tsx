import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FaRegSmile } from "react-icons/fa";

export default function Home() {
  return (
  <div>
    <h1 className="text-3xl text-red-400 font-light">Running</h1>
    <Button 
      color="primary" 
      variant="bordered" 
      startContent={<FaRegSmile size={20} />}
      as = {Link}
      href='/members'
      > Members
    </Button>
  </div>
  );
}
