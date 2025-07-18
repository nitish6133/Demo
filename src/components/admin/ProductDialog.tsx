import React, { useState, useEffect, useRef } from 'react';
import { Product, Specifications } from '../../types';
import Dialog from '../common/Dialog';
import { productService, tagService } from '../../services';
import { Tag } from '../../types';
import { Upload, X, Plus, Minus, Image as ImageIcon, Move, Eye } from 'lucide-react';

interface ProductDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Partial<Product>) => void;
    product: Product | null;
    categories: string[];
    tags: string[];
    loading?: boolean;
    mode?: 'add' | 'edit';
    uploadProductImage?: (file: File) => Promise<string | null>;
}

interface ImageFile {
    id: string;
    file: File;
    preview: string;
    uploaded?: boolean;
    url?: string;
}

interface ProductFormData {
    name: string;
    slug: string;
    category: string;
    description: string;
    price: number;
    comparePrice: number;
    images: string[];
    preorderAvailable: boolean;
    inStock: boolean;
    specifications: {
        material: string;
        weight: string;
        dimensions: string;
        gemstone: string;
    };
    rating: number;
    reviews: number;
    featured: boolean;
    tags: string[];
    noOfProducts: number;
    variants: Record<string, any>;
    visibility: boolean;
    sortOrder: number;
    viewCount: number;
    salesCount: number;
    stockAlert: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
        weight: number;
    };
    seoKeywords: string[];
    relatedProducts: string[];
    metaTitle: string;
    metaDescription: string;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    product,
    categories,
    tags,
    loading = false,
    mode = 'edit',
}) => {
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        slug: '',
        category: '',
        description: '',
        price: 0,
        comparePrice: 0,
        images: [],
        preorderAvailable: false,
        inStock: true,
        specifications: {
            material: '',
            weight: '',
            dimensions: '',
            gemstone: '',
        },
        rating: 0,
        reviews: 0,
        featured: false,
        tags: [],
        noOfProducts: 0,
        variants: {},
        visibility: true,
        sortOrder: 0,
        viewCount: 0,
        salesCount: 0,
        stockAlert: 0,
        dimensions: {
            length: 0,
            width: 0,
            height: 0,
            weight: 0,
        },
        seoKeywords: [],
        relatedProducts: [],
        metaTitle: '',
        metaDescription: '',
    });

    const [specKey, setSpecKey] = useState('');
    const [specValue, setSpecValue] = useState('');

    // Load available tags when dialog opens
    useEffect(() => {
        if (isOpen) {
            loadAvailableTags();
            if (mode === 'add') {
                // Reset form for add mode
                setFormData({
                    name: '',
                    slug: '',
                    category: '',
                    description: '',
                    price: 0,
                    comparePrice: 0,
                    images: [],
                    preorderAvailable: false,
                    inStock: true,
                    specifications: {
                        material: '',
                        weight: '',
                        dimensions: '',
                        gemstone: '',
                    },
                    rating: 0,
                    reviews: 0,
                    featured: false,
                    tags: [],
                    noOfProducts: 0,
                    variants: {},
                    visibility: true,
                    sortOrder: 0,
                    viewCount: 0,
                    salesCount: 0,
                    stockAlert: 0,
                    dimensions: {
                        length: 0,
                        width: 0,
                        height: 0,
                        weight: 0,
                    },
                    seoKeywords: [],
                    relatedProducts: [],
                    metaTitle: '',
                    metaDescription: '',
                });
                setImageFiles([]);
            }
        }
    }, [isOpen, mode]);

    const loadAvailableTags = async () => {
        try {
            const response = await tagService.getTags();
            setAvailableTags(response.result || []);
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

    useEffect(() => {
        if (product && mode === 'edit') {
            setFormData({
                name: product.name || '',
                slug: product.slug || '',
                category: product.category || '',
                description: product.description || '',
                price: product.price || 0,
                comparePrice: product.comparePrice || 0,
                images: product.images || [],
                preorderAvailable: product.preorderAvailable || false,
                inStock: product.inStock ?? true,
                specifications: {
                    material: product.specifications?.material || '',
                    weight: product.specifications?.weight || '',
                    dimensions: product.specifications?.dimensions || '',
                    gemstone: product.specifications?.gemstone || '',
                },
                rating: product.rating || 0,
                reviews: product.reviews || 0,
                featured: product.featured || false,
                tags: product.tags || [],
                noOfProducts: product.noOfProducts || 0,
                variants: product.variants || {},
                visibility: product.visibility ?? true,
                sortOrder: product.sortOrder || 0,
                viewCount: product.viewCount || 0,
                salesCount: product.salesCount || 0,
                stockAlert: product.stockAlert || 0,
                dimensions: product.dimensions || {
                    length: 0,
                    width: 0,
                    height: 0,
                    weight: 0
                },
                seoKeywords: product.seoKeywords || [],
                relatedProducts: product.relatedProducts || [],
                metaTitle: product.metaTitle || '',
                metaDescription: product.metaDescription || '',
            });
            
            // Convert existing images to ImageFile format for editing
            const existingImages: ImageFile[] = (product.images || []).map((url, index) => ({
                id: `existing-${index}`,
                file: null as any, // Existing images don't have files
                preview: url.startsWith('http') ? url : `/api/static/image/${url}`,
                uploaded: true,
                url: url
            }));
            setImageFiles(existingImages);
        }
    }, [product, mode]);

    // Drag and drop handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        handleFiles(files);
    };

    const handleFiles = (files: File[]) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        const newImageFiles: ImageFile[] = imageFiles.map(file => ({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
            uploaded: false
        }));

        setImageFiles(prev => [...prev, ...newImageFiles]);
    };

    const removeImage = (id: string) => {
        setImageFiles(prev => {
            const updated = prev.filter(img => img.id !== id);
            // Revoke object URLs to prevent memory leaks
            const removed = prev.find(img => img.id === id);
            if (removed && !removed.uploaded) {
                URL.revokeObjectURL(removed.preview);
            }
            return updated;
        });
    };

    const reorderImages = (fromIndex: number, toIndex: number) => {
        setImageFiles(prev => {
            const updated = [...prev];
            const [removed] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, removed);
            return updated;
        });
    };

    const uploadImages = async (): Promise<string[]> => {
        const uploadedUrls: string[] = [];
        
        for (const imageFile of imageFiles) {
            if (imageFile.uploaded && imageFile.url) {
                // Already uploaded or existing image
                uploadedUrls.push(imageFile.url);
            } else if (imageFile.file) {
                // New image that needs uploading
                try {
                    const formData = new FormData();
                    formData.append('file', imageFile.file);

                    const response = await fetch('/api/auth/upload-file', {
                        method: 'POST',
                        body: formData,
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error(`Upload failed: ${response.status}`);
                    }

                    const result = await response.json();
                    if (result.code === 2011 && result.result) {
                        // Use the static mount URL format
                        const fullUrl = `/api/static/image/${result.result}`;
                        uploadedUrls.push(fullUrl);
                    } else {
                        throw new Error('Invalid upload response');
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    throw error;
                }
            }
        }
        
        return uploadedUrls;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        // Handle nested objects
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof ProductFormData] as any),
                    [child]: type === 'number' ? parseFloat(value) || 0 : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? parseFloat(value) || 0 : value
            }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleTagsChange = (selectedTags: string[]) => {
        setFormData(prev => ({
            ...prev,
            tags: selectedTags
        }));
    };

    const handleAddSpecification = () => {
        if (specKey && specValue) {
            setFormData(prev => ({
                ...prev,
                specifications: {
                    ...prev.specifications,
                    [specKey]: specValue,
                }
            }));
            setSpecKey('');
            setSpecValue('');
        }
    };

    const handleRemoveSpecification = (key: string) => {
        setFormData(prev => ({
            ...prev,
            specifications: Object.fromEntries(
                Object.entries(prev.specifications).filter(([k]) => k !== key)
            ) as any
        }));
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: prev.slug || generateSlug(name),
            metaTitle: prev.metaTitle || name
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name?.trim()) {
            alert('Product name is required');
            return;
        }

        if (!formData.category?.trim()) {
            alert('Product category is required');
            return;
        }

        try {
            setUploading(true);
            
            // Upload images first
            const uploadedImageUrls = await uploadImages();
            
            // Prepare the final product data matching ProductImportModel
            const productData = {
                name: formData.name,
                slug: formData.slug || generateSlug(formData.name),
                category: formData.category,
                description: formData.description,
                price: formData.price,
                comparePrice: formData.comparePrice,
                images: uploadedImageUrls,
                preorderAvailable: formData.preorderAvailable,
                inStock: formData.inStock,
                specifications: formData.specifications,
                rating: formData.rating,
                reviews: formData.reviews,
                featured: formData.featured,
                tags: formData.tags,
                noOfProducts: formData.noOfProducts,
                variants: formData.variants,
                visibility: formData.visibility,
                sortOrder: formData.sortOrder,
                viewCount: formData.viewCount,
                salesCount: formData.salesCount,
                stockAlert: formData.stockAlert,
                dimensions: formData.dimensions,
                seoKeywords: formData.seoKeywords,
                relatedProducts: formData.relatedProducts,
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
            };

            onSave(productData);
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            title={mode === 'add' ? 'Add New Product' : 'Edit Product'} 
            maxWidth="2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[75vh]">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter product name"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price || ''}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Compare Price
                        </label>
                        <input
                            type="number"
                            name="comparePrice"
                            value={formData.comparePrice || ''}
                            onChange={handleInputChange}
                            placeholder="Original price"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Quantity
                        </label>
                        <input
                            type="number"
                            name="noOfProducts"
                            placeholder="Available quantity"
                            value={formData.noOfProducts || ''}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug
                        </label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            placeholder="product-slug"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Product description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Images
                    </label>
                    
                    {/* Drag and Drop Area */}
                    <div
                        ref={dragRef}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            dragActive 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                        }`}
                    >
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                            Drag and drop images here, or <span className="text-purple-600">click to browse</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Supports: JPG, PNG, GIF (Max 5MB each)
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                    />

                    {/* Image Previews */}
                    {imageFiles.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {imageFiles.map((imageFile, index) => (
                                <div key={imageFile.id} className="relative group">
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={imageFile.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                    {/* Image Controls */}
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => reorderImages(index, index - 1)}
                                                className="p-1 bg-white rounded-full hover:bg-gray-100"
                                                title="Move left"
                                            >
                                                <Move className="h-3 w-3 rotate-180" />
                                            </button>
                                        )}
                                        
                                        <button
                                            type="button"
                                            onClick={() => window.open(imageFile.preview, '_blank')}
                                            className="p-1 bg-white rounded-full hover:bg-gray-100"
                                            title="Preview"
                                        >
                                            <Eye className="h-3 w-3" />
                                        </button>
                                        
                                        {index < imageFiles.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={() => reorderImages(index, index + 1)}
                                                className="p-1 bg-white rounded-full hover:bg-gray-100"
                                                title="Move right"
                                            >
                                                <Move className="h-3 w-3" />
                                            </button>
                                        )}
                                        
                                        <button
                                            type="button"
                                            onClick={() => removeImage(imageFile.id)}
                                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            title="Remove"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                    
                                    {/* Upload Status */}
                                    <div className="absolute top-1 left-1">
                                        {imageFile.uploaded ? (
                                            <div className="w-2 h-2 bg-green-500 rounded-full" title="Uploaded" />
                                        ) : (
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Pending upload" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[42px]">
                        {availableTags.map(tag => (
                            <label key={tag.id} className="flex items-center space-x-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={(formData.tags || []).includes(tag.name)}
                                    onChange={(e) => {
                                        const currentTags = formData.tags || [];
                                        if (e.target.checked) {
                                            handleTagsChange([...currentTags, tag.name]);
                                        } else {
                                            handleTagsChange(currentTags.filter(t => t !== tag.name));
                                        }
                                    }}
                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">{tag.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Toggle Switches */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { key: 'inStock', label: 'In Stock' },
                        { key: 'featured', label: 'Featured' },
                        { key: 'preorderAvailable', label: 'Preorder' },
                        { key: 'visibility', label: 'Visible' }
                    ].map(({ key, label }) => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name={key}
                                checked={formData[key as keyof ProductFormData] as boolean}
                                onChange={handleCheckboxChange}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">{label}</span>
                        </label>
                    ))}
                </div>

                {/* Specifications */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specifications
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <input
                                type="text"
                                name="specifications.material"
                                value={formData.specifications.material}
                                onChange={handleInputChange}
                                placeholder="Material (e.g., Silver)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="specifications.weight"
                                value={formData.specifications.weight}
                                onChange={handleInputChange}
                                placeholder="Weight (e.g., 10g)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="specifications.dimensions"
                                value={formData.specifications.dimensions}
                                onChange={handleInputChange}
                                placeholder="Dimensions (e.g., 2x3 cm)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="specifications.gemstone"
                                value={formData.specifications.gemstone}
                                onChange={handleInputChange}
                                placeholder="Gemstone (e.g., Diamond)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Dimensions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dimensions
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <input
                                type="number"
                                name="dimensions.length"
                                value={formData.dimensions.length || ''}
                                onChange={handleInputChange}
                                placeholder="Length"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                name="dimensions.width"
                                value={formData.dimensions.width || ''}
                                onChange={handleInputChange}
                                placeholder="Width"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                name="dimensions.height"
                                value={formData.dimensions.height || ''}
                                onChange={handleInputChange}
                                placeholder="Height"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                name="dimensions.weight"
                                value={formData.dimensions.weight || ''}
                                onChange={handleInputChange}
                                placeholder="Weight"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* SEO Fields */}
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Title
                        </label>
                        <input
                            type="text"
                            name="metaTitle"
                            value={formData.metaTitle}
                            onChange={handleInputChange}
                            placeholder="SEO meta title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Description
                        </label>
                        <textarea
                            name="metaDescription"
                            value={formData.metaDescription}
                            onChange={handleInputChange}
                            rows={2}
                            placeholder="SEO meta description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading || uploading}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <span>{mode === 'add' ? 'Create Product' : 'Save Changes'}</span>
                        )}
                    </button>
                </div>
            </form>
        </Dialog>
    );
};

export default ProductDialog;