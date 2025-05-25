'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: string
    name: string | null
    email: string | null
    image: string | null
}

interface ProfileFormProps {
    user: User
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [imagePreview, setImagePreview] = useState<string | null>(user.image || null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        let imageUrl = user.image
        if (imageFile) {
            const formDataImg = new FormData()
            formDataImg.append('image', imageFile)
            try {
                console.log('Uploading image:', {
                    name: imageFile.name,
                    type: imageFile.type,
                    size: imageFile.size
                })
                const res = await fetch('/api/user/profile-picture', {
                    method: 'POST',
                    body: formDataImg
                })
                const data = await res.json()
                console.log('Upload response:', {
                    status: res.status,
                    ok: res.ok,
                    data
                })
                if (res.ok) {
                    imageUrl = data.url
                } else {
                    setMessage({ type: 'error', text: data.error || 'Failed to upload image' })
                    setIsLoading(false)
                    return
                }
            } catch (error) {
                console.error('Error uploading image:', error)
                setMessage({ type: 'error', text: 'Failed to upload image' })
                setIsLoading(false)
                return
            }
        }

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData, image: imageUrl })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile')
            }

            setMessage({ type: 'success', text: 'Profile updated successfully' })
            setIsEditing(false)
            router.refresh()
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to update profile'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message.text}</div>
            )}
            <div className="flex items-center space-x-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                    <img
                        src={imagePreview || '/default-avatar.png'}
                        alt={formData.name || 'User'}
                        className="object-cover w-full h-full"
                    />
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 text-xs hover:bg-blue-700"
                        >
                            Edit
                        </button>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={!isEditing}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleEditToggle}
                    className={`px-4 py-2 rounded-lg ${isEditing ? 'bg-gray-400 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
                >
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEditing}
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEditing}
                />
            </div>
            <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading || !isEditing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
} 