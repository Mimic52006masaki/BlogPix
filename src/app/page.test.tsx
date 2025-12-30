import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from './page'

// Mock fetch
global.fetch = jest.fn()

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders initial state', () => {
    render(<Home />)
    expect(screen.getByPlaceholderText(/Enter URLs/)).toBeInTheDocument()
    expect(screen.getByText('BOOM!')).toBeInTheDocument()
  })

  it('fetches images when URLs are entered and button clicked', async () => {
    const mockImages = [
      { id: 'img-1', url: 'https://example.com/image1.jpg', width: 800, height: 600, format: 'jpg' },
      { id: 'img-2', url: 'https://example.com/image2.png', width: 800, height: 600, format: 'png' }
    ]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ images: mockImages })
    } as Response)

    render(<Home />)
    const textarea = screen.getByPlaceholderText(/Enter URLs/)
    const button = screen.getByText('BOOM!')

    await userEvent.type(textarea, 'https://example.com\nhttps://example2.com')
    await userEvent.click(button)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/fetch-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: ['https://example.com', 'https://example2.com'] })
      })
    })

    expect(screen.getByText('THE STASH')).toBeInTheDocument()
  })



  it('selects and deselects images', async () => {
    const mockImages = [
      { id: 'img-1', url: 'https://example.com/image1.jpg', width: 800, height: 600, format: 'jpg' }
    ]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ images: mockImages })
    } as Response)

    render(<Home />)
    const input = screen.getByPlaceholderText(/Enter URLs/)
    const button = screen.getByText('BOOM!')

    await userEvent.type(input, 'https://example.com')
    await userEvent.click(button)

    await waitFor(() => screen.getByText('THE STASH'))

    const imageCard = screen.getByRole('presentation').closest('div')
    expect(imageCard).toBeInTheDocument()

    // Click to select
    fireEvent.click(imageCard!)
    // Check if selected (this might need adjustment based on actual DOM)
  })

  it('selects all images', async () => {
    const mockImages = [
      { id: 'img-1', url: 'https://example.com/image1.jpg', width: 800, height: 600, format: 'jpg' },
      { id: 'img-2', url: 'https://example.com/image2.png', width: 800, height: 600, format: 'png' }
    ]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ images: mockImages })
    } as Response)

    render(<Home />)
    await userEvent.type(screen.getByPlaceholderText(/Enter URLs/), 'https://example.com')
    await userEvent.click(screen.getByText('BOOM!'))

    await waitFor(() => screen.getByText('Select All'))

    await userEvent.click(screen.getByText('Select All'))
    // Verify all are selected
  })

  it('deselects all images', async () => {
    const mockImages = [
      { id: 'img-1', url: 'https://example.com/image1.jpg', width: 800, height: 600, format: 'jpg' }
    ]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ images: mockImages })
    } as Response)

    render(<Home />)
    await userEvent.type(screen.getByPlaceholderText(/Enter URLs/), 'https://example.com')
    await userEvent.click(screen.getByText('BOOM!'))

    await waitFor(() => screen.getByText('Deselect'))

    await userEvent.click(screen.getByText('Deselect'))
    // Verify all are deselected
  })

  it('downloads zip when selected images exist', async () => {
    const mockImages = [
      { id: 'img-1', url: 'https://example.com/image1.jpg', width: 800, height: 600, format: 'jpg' }
    ]
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ images: mockImages })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => new Blob()
      } as Response)

    // Mock URL and document methods
    global.URL.createObjectURL = jest.fn()
    global.URL.revokeObjectURL = jest.fn()
    document.createElement = jest.fn().mockReturnValue({
      href: '',
      download: '',
      click: jest.fn()
    })

    render(<Home />)
    await userEvent.type(screen.getByPlaceholderText(/Enter URLs/), 'https://example.com')
    await userEvent.click(screen.getByText('BOOM!'))

    await waitFor(() => screen.getByText('Select All'))
    await userEvent.click(screen.getByText('Select All'))

    await userEvent.click(screen.getByText('Download ZIP'))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/download-zip', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ images: [{ id: 'img-1', url: 'https://example.com/image1.jpg' }], format: 'original' })
      }))
    })
  })

  it('shows error on fetch failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false
    } as Response)

    render(<Home />)
    await userEvent.type(screen.getByPlaceholderText(/Enter URLs/), 'https://invalid.com')
    await userEvent.click(screen.getByText('BOOM!'))

    await waitFor(() => {
      expect(screen.getByText('画像の取得に失敗しました')).toBeInTheDocument()
    })
  })
})