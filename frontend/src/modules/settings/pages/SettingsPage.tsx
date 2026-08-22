export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Workspace
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-gray-900">
          Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your account, organization, and application preferences.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Settings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Settings sections will appear here.
        </p>
      </div>
    </div>
  );
}