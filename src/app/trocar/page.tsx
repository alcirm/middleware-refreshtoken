import { cookies } from 'next/headers';
export default function Trocar() {
  const cookieValue = cookies().get('cookieValue');
  return <h1>{`trocar ${cookieValue?.value}`}</h1>;
}
