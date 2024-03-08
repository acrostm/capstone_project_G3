'use client'

import Link from 'next/link'
import { Popover } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLinks } from '@/components/NavLinks'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronUpIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MobileNavLink(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof Popover.Button<typeof Link>>,
    'as' | 'className'
  >,
) {
  return (
    <Popover.Button
      as={Link}
      className="block text-base leading-7 tracking-tight text-gray-700"
      {...props}
    />
  )
}

export function Header() {
  const [loggedIn, setLoggedIn] = useState(true);
  const router = useRouter();

  const checkAndRedirect = async () => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      });
      setLoggedIn(response.ok);
    } catch (error) {
      console.error('Error checking user token:', error);
    }
  };

  const handleLogout = () => {
    // 清除 localStorage 中的 token，并显示登录界面
    localStorage.removeItem('token');
    router.push('/');
  };

  useEffect(() => {
    checkAndRedirect();
  }, [loggedIn]); // 监听 loggedIn 变化
  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-between py-8">
          <div className="relative z-10 flex items-center gap-16">
            <Link href="/" aria-label="Home">
              <Logo className="h-10 w-auto" />
            </Link>
            <div className="hidden lg:flex lg:gap-10">
              <NavLinks />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Popover className="lg:hidden">
              {({ open }) => (
                <>
                  <Popover.Button
                    className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 ui-not-focus-visible:outline-none"
                    aria-label="Toggle site navigation"
                  >
                    {({ open }) =>
                      open ? (
                        <ChevronUpIcon className="h-6 w-6" />
                      ) : (
                        <MenuIcon className="h-6 w-6" />
                      )
                    }
                  </Popover.Button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <>
                        <Popover.Overlay
                          static
                          as={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
                        />
                        <Popover.Panel
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -32 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -32,
                            transition: { duration: 0.2 },
                          }}
                          className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
                        >
                          <div className="space-y-4">
                            <MobileNavLink href="/">
                              Intro
                            </MobileNavLink>
                            <MobileNavLink href="/ml">
                              AI
                            </MobileNavLink>
                            <MobileNavLink href="/info">
                              Account
                            </MobileNavLink>
                            <MobileNavLink href="/about">About us</MobileNavLink>
                          </div>
                          <div className="mt-8 flex flex-col gap-4">
                            {!loggedIn ? (
                              <><Button href="/login" variant="outline">
                                Log in
                              </Button><Button href="/register">Sign up</Button></>) : (
                                <Button variant="solid" color="cyan" onClick={handleLogout}>
                                  Sign out
                                </Button>
                              )}
                          </div>
                        </Popover.Panel>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>
            {!loggedIn ? (<>
              <Button href="/login" variant="outline" className="hidden lg:block">
                Log in
              </Button><Button href="/register" className="hidden lg:block">
                Sign up
              </Button>
              </>) : (
                <Button variant="solid" color="cyan" onClick={handleLogout}>
                  Sign out
                </Button>
              )}
          </div>
        </Container>
      </nav>
    </header>
  )
}
