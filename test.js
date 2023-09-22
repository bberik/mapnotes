import fs from 'fs'
import path from 'path'
import ignore from 'ignore' // npm install ignore

const gitignorePath = './.gitignore'; // Path to your .gitignore file

var walk = function (dir, ignorePatterns = []) {
    var results = [];
    var list = fs.readdirSync(dir);
    var ignoreFilter = ignore().add(ignorePatterns); // Create ignore filter

    list.forEach(function (file) {
        file = path.join(dir, file);
        var stat = fs.statSync(file);

        if (!ignoreFilter.ignores(file) && stat && (path.basename(file) !== '.git' && !path.basename(file).startsWith('.'))) {
            if (stat.isDirectory()) {
                /* Recurse into a subdirectory */
                results.push(
                    {
                        name: path.basename(file),
                        type: 'folder',
                        content: walk(file, ignorePatterns)
                    });
            } else {
                /* Is a file */
                results.push({
                    name: path.basename(file),
                    type: "file"
                });
            }
        }
    });

    return results;
}

// Read the .gitignore file and extract patterns
fs.readFile(gitignorePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading .gitignore:', err);
        return;
    }

    const ignorePatterns = data.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));

    const directoryToStartWalking = '.';
    const fileList = walk(directoryToStartWalking, ignorePatterns);

    console.log('Filtered file list:', fileList);

    // Create nodes and edges
    // const nodes = [];
    // const edges = [];

    // fileList.forEach(filePath => {
    //     const parts = filePath.split('/');
    //     let parent = { id: 'root', position: { x: 500, y: 500 }, data: { label: 'MyProject' } };
    //     let parentNodeId = 'root'; // Default parent node ID
    //     let level = 0;

    //     parts.forEach((part, index) => {
    //         const nodeId = parts.slice(0, index + 1).join('/');
    //         const nodeLabel = part;
    //         const existingNode = nodes.find(node => node.id === nodeId);

    //         if (!existingNode) {
    //             const newNode = {
    //                 id: nodeId,
    //                 position: { x: index * 200, y: level * 100 + 500 }, // Adjust position based on index and level
    //                 data: { label: nodeLabel }
    //             };
    //             nodes.push(newNode);
    //         }

    //         if (parent) {
    //             edges.push({ id: `e-${parentNodeId}-${nodeId}`, source: parentNodeId, target: nodeId });
    //         }

    //         parent = nodeId;
    //         parentNodeId = nodeId;
    //         level = index; // Update the level for the next iteration
    //     });
    // });

    // console.log('Nodes:', nodes);
    // console.log('Edges:', edges);

});


