import { TimesheetDetail } from '@/components/timesheet';

type Props = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: Props) => {
  const resolved = await params;

  return <TimesheetDetail yearId={resolved.id} />;
};

export default Page;
