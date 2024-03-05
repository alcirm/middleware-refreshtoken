import { cookies } from 'next/headers';
export default async function Conferir() {
  const cookieValue = cookies().get('cookieValue');
  return <h1>{`conferir ${cookieValue?.value}`}</h1>;
}
