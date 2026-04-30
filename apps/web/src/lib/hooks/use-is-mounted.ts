"use client";

import React from "react";

/**
 * Trả về `false` ở SSR và lần render đầu trên client (để match HTML server),
 * sau đó trở thành `true` sau khi hydrate xong.
 *
 * Dùng thay cho pattern `useState(false) + useEffect(() => setMounted(true), [])`
 * vốn vi phạm rule `react-hooks/set-state-in-effect` của React 19.
 */
export function useIsMounted(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
