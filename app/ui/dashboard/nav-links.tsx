// 这个组件及其引用的所有子组件，都属于“客户端组件（Client Component）
'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useEffect } from 'react';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: '首页', href: '/dashboard', icon: HomeIcon },
  {
    name: '发票',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: '客户', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  // usePathname获取当前url路径 例如：/dashboard/invoices
  const pathname = usePathname();
  useEffect(() => (console.log(pathname)), [pathname])
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
