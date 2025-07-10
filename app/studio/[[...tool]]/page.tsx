'use client'

/**
 * This route is responsible for the interactive Sanity Studio that loads in the browser.
 * All routes under `/studio` will render the Studio.
 *
 * Route: /studio/*
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export const dynamic = 'force-dynamic'

export default function StudioPage() {
  return <NextStudio config={config} />
}