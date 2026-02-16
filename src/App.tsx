import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'

function App() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => {
      setCount((count) => count + 1)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Sistem Pemesanan Menu UMKM
          </h1>
          <p className="text-slate-600">
            Frontend dengan React + TypeScript + Vite + TailwindCSS + shadcn/ui
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Badge>Phase 1 ✓</Badge>
            <Badge variant="secondary">Phase 2 ✓</Badge>
            <Badge variant="outline">TailwindCSS v4</Badge>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Phase 2 Complete! 🎨</CardTitle>
            <CardDescription>
              TailwindCSS dan shadcn/ui components berhasil disetup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="test-input">Test Input Field</Label>
              <Input
                id="test-input"
                type="text"
                placeholder="Type something..."
                className="mt-1"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleClick} disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    Loading...
                  </span>
                ) : (
                  `Clicked ${count} times`
                )}
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Button Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button size="sm">Small Button</Button>
                <Button size="default">Default Button</Button>
                <Button size="lg">Large Button</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Badge Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loading States</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Form Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Password" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checklist Card */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">
              ✅ Phase 2 Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                TailwindCSS v4 installed and configured
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                PostCSS configured with autoprefixer
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                Design system setup (colors, spacing, typography)
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                shadcn/ui components created (Button, Card, Input, Badge,
                Label, Spinner)
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                Utility function (cn) for className merging
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                Production build verified
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-green-700">
              🚀 Ready for Phase 3: Core Infrastructure
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default App
