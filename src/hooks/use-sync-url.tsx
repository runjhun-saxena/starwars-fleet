'use client';

import { useEffect, useRef } from 'react';
import {
  usePathname,
  useRouter,
  useSearchParams,
  ReadonlyURLSearchParams,
} from 'next/navigation';
import { useAtom } from 'jotai';
import {
  searchAtom,
  hyperdriveFilterAtom,
  crewFilterAtom,
  sortAtom,
  selectedUrlsAtom,
} from '@/store/starship';

export function useRestoreFromUrl() {
  const sp = useSearchParams();

  const [, setSearch] = useAtom(searchAtom);
  const [, setHyper]  = useAtom(hyperdriveFilterAtom);
  const [, setCrew]   = useAtom(crewFilterAtom);
  const [, setSort]   = useAtom(sortAtom);
  const [, setSel]    = useAtom(selectedUrlsAtom);

  useEffect(() => {
    const q     = sp.get('q')     ?? '';
    const hyper = sp.get('hyper') ?? 'all';
    const crew  = sp.get('crew')  ?? 'all';
    const sort  = sp.get('sort');     
    const sel   = sp.get('selected');   

    setSearch(q);
    setHyper(hyper);
    setCrew(crew);

    if (sort) {
      const [col, dir] = sort.split(':');
      if (col === 'hyperdrive') {
        setSort({ col: 'hyperdrive', dir: dir === 'desc' ? 'desc' : 'asc' });
      }
    }
    if (sel) {
      const urls = sel.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);
      setSel(urls);
    } else {
      setSel([]);
    }
  }, []); 
}


export function useSyncUrl() {
  const router   = useRouter();
  const pathname = usePathname();

  const [q]     = useAtom(searchAtom);
  const [hyper] = useAtom(hyperdriveFilterAtom);
  const [crew]  = useAtom(crewFilterAtom);
  const [sort]  = useAtom(sortAtom);
  const [sel]   = useAtom(selectedUrlsAtom);

  const last = useRef<string>('');

  useEffect(() => {
    const params = new URLSearchParams();

    if (q) params.set('q', q);
    if (hyper !== 'all') params.set('hyper', hyper);
    if (crew  !== 'all') params.set('crew', crew);
    if (sort.col) params.set('sort', `hyperdrive:${sort.dir}`);
    if (sel.length) params.set('selected', sel.join(','));

    const next = params.toString();
    if (next === last.current) return; // no-op

    last.current = next;
    const url = next ? `${pathname}?${next}` : pathname;
    router.replace(url, { scroll: false });
  }, [q, hyper, crew, sort, sel, pathname, router]);
}

export function setSheetInUrl(
  open: boolean,
  currentSearchParams: ReadonlyURLSearchParams,
  pathname: string,
  router: ReturnType<typeof useRouter>
) {
  const params = new URLSearchParams(currentSearchParams?.toString() || '');
  if (open) params.set('sheet', '1');
  else params.delete('sheet');
  const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
  router.replace(url, { scroll: false });
}
