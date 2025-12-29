import { POST } from './route'
import axios from 'axios'
import JSZip from 'jszip'
import sharp from 'sharp'

// Mock dependencies
jest.mock('axios')
jest.mock('jszip')
jest.mock('sharp')

// Mock Response
global.Response = class {
  constructor(body: any, options: any) {
    this.body = body
    this.options = options
  }
  body: any
  options: any
}

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedJSZip = JSZip as jest.MockedClass<typeof JSZip>
const mockedSharp = sharp as jest.MockedFunction<typeof sharp>

describe('/api/download-zip', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create zip with original format', async () => {
    const mockZip = {
      file: jest.fn(),
      generateAsync: jest.fn().mockResolvedValue(new Blob())
    }
    mockedJSZip.mockReturnValue(mockZip as any)

    mockedAxios.get.mockResolvedValue({ data: Buffer.from('image data') })

    const request = {
      json: jest.fn().mockResolvedValue({
        images: [{ id: 'img-1', url: 'https://example.com/image.jpg' }],
        format: 'original'
      })
    } as unknown as Request

    const response = await POST(request)

    expect(mockedAxios.get).toHaveBeenCalledWith('https://example.com/image.jpg', { responseType: 'arraybuffer' })
    expect(mockZip.file).toHaveBeenCalledWith('img-1.jpg', expect.any(Buffer))
    expect(mockZip.generateAsync).toHaveBeenCalledWith({ type: 'blob' })
    expect(response.headers.get('Content-Type')).toBe('application/zip')
  })

  it('should convert format using sharp', async () => {
    const mockZip = {
      file: jest.fn(),
      generateAsync: jest.fn().mockResolvedValue(new Blob())
    }
    mockedJSZip.mockReturnValue(mockZip as any)

    const mockSharpInstance = {
      toFormat: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(Buffer.from('converted'))
    }
    mockedSharp.mockReturnValue(mockSharpInstance as any)
    mockedAxios.get.mockResolvedValue({ data: Buffer.from('image data') })

    const request = {
      json: jest.fn().mockResolvedValue({
        images: [{ id: 'img-1', url: 'https://example.com/image.jpg' }],
        format: 'png'
      })
    } as unknown as Request

    await POST(request)

    expect(mockedSharp).toHaveBeenCalledWith(Buffer.from('image data'))
    expect(mockSharpInstance.toFormat).toHaveBeenCalledWith('png')
    expect(mockZip.file).toHaveBeenCalledWith('img-1.png', Buffer.from('converted'))
  })

  it('should skip failed images', async () => {
    const mockZip = {
      file: jest.fn(),
      generateAsync: jest.fn().mockResolvedValue(new Blob())
    }
    mockedJSZip.mockReturnValue(mockZip as any)

    mockedAxios.get.mockRejectedValueOnce(new Error('Failed')).mockResolvedValueOnce({ data: Buffer.from('good') })

    const request = {
      json: jest.fn().mockResolvedValue({
        images: [
          { id: 'img-1', url: 'https://example.com/bad.jpg' },
          { id: 'img-2', url: 'https://example.com/good.jpg' }
        ],
        format: 'original'
      })
    } as unknown as Request

    await POST(request)

    expect(mockZip.file).toHaveBeenCalledTimes(1)
    expect(mockZip.file).toHaveBeenCalledWith('img-2.jpg', expect.any(Buffer))
  })
})