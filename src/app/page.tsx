import { Metadata } from 'next';
import { Dashboard } from '@/components/dashboard/Dashboard';

export const metadata: Metadata = {
  title: '관리자 대시보드 - MyPick Admin',
  description: 'MyPick 플랫폼 관리자 대시보드',
};

export default function AdminDashboardPage(): JSX.Element {
  return <Dashboard />;
}