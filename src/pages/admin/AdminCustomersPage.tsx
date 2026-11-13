import { useEffect, useState } from 'react';
import { SeoHead } from '../../components/common/SeoHead';
import { useStore } from '../../context/StoreContext';
import { adminFetchCustomers } from '../../services/adminService';
import { Profile } from '../../types';
import { formatDate } from '../../utils/format';

export function AdminCustomersPage() {
  const { showToast } = useStore();
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'customer' | 'admin'>('ALL');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setCustomers(await adminFetchCustomers());
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Unable to load customers.', 'error');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = customers.filter((c) => {
    if (roleFilter !== 'ALL' && c.role !== roleFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (c.full_name || '').toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    );
  });

  return (
    <>
      <SeoHead title="Customer Directory · Admin" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#52525B] dark:text-[#D7FF45] font-semibold mb-1">
              CRM & Members
            </p>
            <h1 className="font-editorial text-3xl font-semibold">
              Customers ({customers.length})
            </h1>
            <p className="text-sm text-[#52525B] dark:text-[#C5C7CB]">
              Registered SOLEVERSE collector profiles and account roles.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by full name, email, or phone..."
            className="flex-1 min-w-[240px] max-w-md px-4 py-2.5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/15 text-sm"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
            className="px-4 py-2.5 bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/15 text-sm"
          >
            <option value="ALL">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <div className="bg-white dark:bg-[#202126] border border-[#E5E2DA] dark:border-white/10 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F5F3ED] dark:bg-[#101114] border-b border-[#E5E2DA] dark:border-white/10 text-xs uppercase tracking-wider text-[#52525B] dark:text-[#C5C7CB]">
              <tr>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2DA] dark:divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#52525B] dark:text-[#C5C7CB]">
                    Loading customer directory...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#52525B] dark:text-[#C5C7CB]">
                    No accounts match your query.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F5F3ED]/60 dark:hover:bg-[#101114]/40">
                    <td className="py-3 px-4 font-medium">{c.full_name || '—'}</td>
                    <td className="py-3 px-4 text-[#52525B] dark:text-[#C5C7CB]">{c.email}</td>
                    <td className="py-3 px-4 font-mono text-xs">{c.phone || '—'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-mono uppercase ${
                          c.role === 'admin'
                            ? 'bg-[#D7FF45] text-[#101114] font-bold'
                            : 'bg-[#F5F3ED] dark:bg-[#101114] text-[#52525B] dark:text-[#C5C7CB]'
                        }`}
                      >
                        {c.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#52525B] dark:text-[#C5C7CB]">
                      {formatDate(c.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
