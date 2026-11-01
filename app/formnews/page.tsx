import { getNewsFormOptions } from '@/app/action/news';
import CreateNewsForm from './FormNewsClient';

export const dynamic = "force-dynamic";

export default async function CreateNewsPage() {
  const options = await getNewsFormOptions();
  return <CreateNewsForm options={options} />;
}
