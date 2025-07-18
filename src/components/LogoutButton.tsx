'use client';

import { logout } from '@/app/(auth)/login/actions';

export default function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await logout();
      }}
      className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
    >
      Cerrar Sesión
    </button>
  );
}
