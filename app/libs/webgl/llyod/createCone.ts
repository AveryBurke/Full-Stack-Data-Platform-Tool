/**
 * Renders the vertices of a 3d cone pointing in the z direction (at the viewer)
 * @param edges the number of edges of the cone
 * @returns an array of vertices
 */
export default function createCone(edges: number) {
    const vertices = new Array();
    vertices[0] = 0;
    vertices[1] = 0;
    vertices[2] = -1;
    for (let i = 0; i <= edges; i++) {
        const angle = 2 * Math.PI * i / edges;
        vertices[i * 3 + 3] = Math.cos(angle);
        vertices[i * 3 + 4] = Math.sin(angle);
        vertices[i * 3 + 5] = 1;
    }
    return vertices;
}