import { useState } from "react";
export const useCostomHook = () => {
const [data,setData] = useState('dinesh');
return [data,setData];
}