import { useEffect, useRef, useState } from "react"
import { Box, Center, Spinner, Text } from "@chakra-ui/react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { FBXLoader } from "three/addons/loaders/FBXLoader.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

const DEFAULT_HEIGHT = 500
const ANIMATION_PRIORITY = ["show", "idle", "idle01", "idle_01", "default", "stand"]

function disposeObject(root) {
    const geometries = new Set()
    const materials = new Set()
    const textures = new Set()

    root.traverse((child) => {
        if (child.isSkinnedMesh && child.skeleton) {
            child.skeleton.dispose()
        }
        if (!child.isMesh) return

        if (child.geometry) geometries.add(child.geometry)

        const childMaterials = Array.isArray(child.material) ? child.material : [child.material]
        childMaterials.forEach((material) => {
            if (!material) return
            materials.add(material)
            Object.values(material).forEach((value) => {
                if (value && value.isTexture) textures.add(value)
            })
        })
    })

    textures.forEach((texture) => texture.dispose())
    materials.forEach((material) => material.dispose())
    geometries.forEach((geometry) => geometry.dispose())
}

function makeToonGradient() {
    const data = new Uint8Array([
        70, 70, 70, 255,
        135, 135, 135, 255,
        200, 200, 200, 255,
        255, 255, 255, 255,
    ])
    const texture = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat)
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.needsUpdate = true
    return texture
}

function convertToToon(object) {
    object.traverse((child) => {
        if (!child.isMesh && !child.isSkinnedMesh) return
        const materials = Array.isArray(child.material) ? child.material : [child.material]
        const toonMaterials = materials.map((material) => {
            if (!material) return material
            const toon = new THREE.MeshToonMaterial({
                map: material.map || null,
                color: material.color ? material.color.clone() : new THREE.Color(0xffffff),
                gradientMap: makeToonGradient(),
                transparent: material.transparent,
                opacity: material.opacity,
                alphaTest: material.alphaTest,
                side: material.side,
                vertexColors: material.vertexColors,
            })
            toon.name = material.name
            return toon
        })
        child.material = Array.isArray(child.material) ? toonMaterials : toonMaterials[0]
    })
}

export const Model3DViewer = ({ modelUrl, height = DEFAULT_HEIGHT, onError, disableVertexColors = false, toon = false, hideOutline = false }) => {
    const containerRef = useRef(null)
    const canvasRef = useRef(null)
    const onErrorRef = useRef(onError)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    useEffect(() => {
        const container = containerRef.current
        const canvas = canvasRef.current
        if (!container || !canvas || !modelUrl) return undefined

        let cancelled = false
        let frameId = null
        let resizeObserver = null
        let renderer = null
        let controls = null
        let mixer = null
        let loadedObject = null
        let scene = null
        let camera = null
        let modelCenter = null
        let modelRadius = 0
        let hasFitted = false

        const timer = new THREE.Timer()
        const viewDirection = new THREE.Vector3(-0.7, 0.15, 0.7).normalize()

        setIsLoading(true)
        setErrorMessage(null)

        const fail = (error) => {
            if (cancelled) return
            console.error("Failed to load 3D model:", error)
            setIsLoading(false)
            setErrorMessage("Failed to load 3D model")
            if (onErrorRef.current) onErrorRef.current(error)
        }

        const fitCamera = () => {
            if (!modelCenter || !camera || !controls) return

            const width = container.clientWidth
            const height = container.clientHeight
            if (!width || !height) return

            const aspect = width / height
            const verticalFov = THREE.MathUtils.degToRad(camera.fov)
            const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect)
            const distance = (modelRadius / Math.sin(Math.min(verticalFov, horizontalFov) / 2)) * 1.15

            camera.aspect = aspect
            camera.near = Math.max(distance / 1000, 0.001)
            camera.far = distance * 100
            camera.position.copy(modelCenter).addScaledVector(viewDirection, distance)
            camera.updateProjectionMatrix()

            controls.target.copy(modelCenter)
            controls.minDistance = distance * 0.15
            controls.maxDistance = distance * 8
            controls.update()
            hasFitted = true
        }

        const resize = () => {
            if (!renderer || !camera) return

            const width = container.clientWidth
            const height = container.clientHeight
            if (!width || !height) return

            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
            renderer.setSize(width, height, false)

            if (!hasFitted) {
                fitCamera()
            }
            else {
                camera.aspect = width / height
                camera.updateProjectionMatrix()
            }
        }

        try {
            scene = new THREE.Scene()
            scene.background = new THREE.Color(0xbfe3dd)

            camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100000)

            renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
            renderer.outputColorSpace = THREE.SRGBColorSpace
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

            scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2.2))

            const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
            keyLight.position.set(3, 6, 5)
            scene.add(keyLight)

            const fillLight = new THREE.DirectionalLight(0xffffff, 1.2)
            fillLight.position.set(-5, 2, -4)
            scene.add(fillLight)

            const rimLight = new THREE.DirectionalLight(0xffffff, 1)
            rimLight.position.set(0, 4, -6)
            scene.add(rimLight)

            controls = new OrbitControls(camera, renderer.domElement)
            controls.enableDamping = true
            controls.dampingFactor = 0.09
            controls.rotateSpeed = 0.09

            resizeObserver = new ResizeObserver(resize)
            resizeObserver.observe(container)
            resize()

            const animate = (timestamp) => {
                frameId = requestAnimationFrame(animate)
                timer.update(timestamp)
                if (mixer) mixer.update(timer.getDelta())
                controls.update()
                renderer.render(scene, camera)
            }
            animate()

            const isGltf = /\.(glb|gltf)(\?|$)/i.test(modelUrl)
            const loader = isGltf ? new GLTFLoader() : new FBXLoader()
            loader.load(modelUrl, (result) => {
                const object = isGltf ? (result.scene || result.scenes?.[0]) : result
                const animations = isGltf ? (result.animations || []) : (result.animations || [])
                if (cancelled) {
                    disposeObject(object)
                    return
                }

                loadedObject = object

                object.traverse((child) => {
                    if (child.isMesh || child.isSkinnedMesh) {
                        // Skinned model bounds can be wrong, so don't let frustum culling hide them.
                        child.frustumCulled = false

                        const materials = Array.isArray(child.material) ? child.material : [child.material]

                        // Crosswave outline meshes are shader-driven inverted hulls whose
                        // exported geometry is coincident with the body. They rely on
                        // normal extrusion that glTF cannot represent, so they would
                        // otherwise appear as solid-color masks and cause z-fighting.
                        if (hideOutline && materials.some((material) => (
                            material && /_OL_|NoLine/i.test(material.name || "")
                        ))) {
                            child.visible = false
                            return
                        }

                        // Some exports (Abyss Horizon, Azur Lane Crosswave) use vertex
                        // colors as shader masks, not diffuse colors. Applying them
                        // tints faces blue/gray.
                        if (disableVertexColors) {
                            materials.forEach((material) => {
                                if (material && material.vertexColors) {
                                    material.vertexColors = false
                                    material.needsUpdate = true
                                }
                            })
                        }
                    }
                })

                if (toon) convertToToon(object)

                if (animations.length > 0) {
                    mixer = new THREE.AnimationMixer(object)
                    const clip = animations.find((animation) => (
                        ANIMATION_PRIORITY.includes((animation.name || "").toLowerCase())
                    )) || animations[0]
                    mixer.clipAction(clip).play()
                }

                scene.add(object)
                object.updateMatrixWorld(true)

                let boundingSphere
                try {
                    boundingSphere = new THREE.Box3().setFromObject(object, true).getBoundingSphere(new THREE.Sphere())
                }
                catch (error) {
                    fail(error)
                    return
                }
                if (!Number.isFinite(boundingSphere.radius) || boundingSphere.radius <= 0) {
                    fail(new Error("The model does not contain visible geometry"))
                    return
                }

                modelCenter = boundingSphere.center
                modelRadius = boundingSphere.radius
                hasFitted = false
                fitCamera()
                setIsLoading(false)
            }, undefined, fail)
        }
        catch (error) {
            fail(error)
        }

        return () => {
            cancelled = true
            if (frameId !== null) cancelAnimationFrame(frameId)
            if (resizeObserver) resizeObserver.disconnect()
            if (controls) controls.dispose()
            if (mixer) mixer.stopAllAction()
            if (loadedObject && scene) {
                scene.remove(loadedObject)
                disposeObject(loadedObject)
            }
            if (renderer) {
                renderer.dispose()
                if (renderer.forceContextLoss) renderer.forceContextLoss()
            }
            timer.dispose()
        }
    }, [modelUrl, disableVertexColors, toon, hideOutline])

    return (
        <Box ref={containerRef} position="relative" width="100%" height={`${height}px`}>
            <canvas
                ref={canvasRef}
                style={{ display: "block", width: "100%", height: `${height}px` }}
            />
            {isLoading && (
                <Center position="absolute" inset={0} bg="blackAlpha.300">
                    <Spinner size="xl" color="white" thickness="3px" />
                </Center>
            )}
            {errorMessage && (
                <Center position="absolute" inset={0} bg="blackAlpha.600">
                    <Text color="white" fontWeight="semibold">{errorMessage}</Text>
                </Center>
            )}
        </Box>
    )
}
