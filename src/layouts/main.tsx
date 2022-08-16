import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

const MainLayout: FC<{ children?: React.ReactNode; mainClass?: string }> = (props) => {
  const router = useRouter()
  const activePath = router.pathname
  const routes = [
    {
      href: '/yaml',
      label: 'YAML',
    },
    {
      href: '/csv',
      label: 'CSV',
    },
  ]
  return (
    <div className="w-screen h-screen grid bg-brand-dark grid-rows-[auto,1fr]">
      <aside className="flex border-b-2 border-brand-middark/80">
        <nav className="flex items-center gap-4">
          {routes.map((route, i) => (
            <Link href={route.href} key={i}>
              <a
                className={
                  'text-white/80 hover:text-indigo-300 transition duration-150 p-2 ' +
                  (route.href === activePath ? 'bg-brand-middark/80' : '')
                }
              >
                {route.label}
              </a>
            </Link>
          ))}
        </nav>
      </aside>
      <main className={'w-full flex flex-col bg-brand-dark ' + props.mainClass}>{props.children}</main>
    </div>
  )
}

export default MainLayout
