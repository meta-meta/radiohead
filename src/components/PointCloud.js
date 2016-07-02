import {Entity} from 'aframe-react';
import React from 'react';
import _ from 'lodash';

const getImageData = ( image ) => {
  var canvas = document.createElement( 'canvas' );
  canvas.width = image.width;
  canvas.height = image.height;

  var context = canvas.getContext( '2d' );
  context.drawImage( image, 0, 0 );

  return context.getImageData( 0, 0, image.width, image.height );

};

const getPixel = ( imagedata, x, y ) => {

  var position = ( x + imagedata.width * y ) * 4, data = imagedata.data;
  return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };

}


class PointCloud extends React.Component {


  onLoaded = (evt, image, gap, dotSize, dotImage) => {
    const el = evt.target;
    const obj = el.object3D;

    var geometry = new THREE.BufferGeometry();

    const vertLengths = _.map(this.props.vertices, 'length');
    const vertStarts = vertLengths.map((l, i) => _(vertLengths).take(i).reduce((acc, val) => acc + val, 0));

    const allVerts = _.flattenDeep(this.props.vertices);

    geometry.addAttribute( 'position', new THREE.BufferAttribute(new Float32Array(allVerts), 3));
    //geometry.addAttribute( 'color', new THREE.BufferAttribute(vertices, 3));

    var numVertices = geometry.attributes.position.count;
    var alphas = new Float32Array( numVertices * 1 ); // 1 values per vertex

    for( var i = 0; i < numVertices; i++ ) {
      alphas[ i ] = Math.random() * 0.7;
    }

    geometry.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );

    var texture = new THREE.TextureLoader().load(dotImage);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    var shaderMaterial = new THREE.ShaderMaterial( {
      uniforms: {
        color: { type: "c", value: new THREE.Color( this.props.color ) },
        texture:   { type: "t", value: texture },
      },
      vertexShader:   `
            attribute float alpha;
            varying float vAlpha;

            void main() {
                vAlpha = alpha;
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_PointSize = ${dotSize * 10}.0 / -mvPosition.z;
                gl_Position = projectionMatrix * mvPosition;
            }
          `,
      fragmentShader: `
            uniform vec3 color;
            uniform sampler2D texture;
            varying float vAlpha;

            void main() {
              vec4 color = vec4( color, vAlpha ) * texture2D( texture, gl_PointCoord );
              gl_FragColor = color;
            }
          `,
      transparent:    true

    });

    shaderMaterial.blending = THREE.AdditiveBlending;
    shaderMaterial.depthTest = false;
    window.mat = shaderMaterial;

    this.cloud = new THREE.Points( geometry, shaderMaterial );

    obj.add( this.cloud );


    let frame = 0;

    const animate = () => {
      // this.lastFrame = new Date();
      var alphas = this.cloud.geometry.attributes.alpha;
      // var count = alphas.count;

      const numFrames = this.props.vertices.length;


      const prevstart = vertStarts[frame % numFrames];
      const prevend = prevstart + vertLengths[frame % numFrames];

      for (var i = prevstart; i < prevend; i++) {
        alphas.array[i] = 0;
      }

      frame++;

      const start = vertStarts[frame % numFrames];
      const end = start + vertLengths[frame % numFrames];

      for (var i = start; i < end; i++) {
        alphas.array[i] = Math.random() * 0.5 + 0.35;
      }



      // for (var i = 0; i < count; i++) {
      //
      //   // dynamically change alphas
      //   alphas.array[i] *= 0.9;
      //
      //   if (alphas.array[i] < 0.5) {
      //     alphas.array[i] = Math.random();
      //   }
      //
      // }

      alphas.needsUpdate = true; // important!

    };

    setInterval(animate, 167);

  };

  render() {
    const {image, gap, dotSize, color, dotImage} = this.props;

    return (
      <Entity {...this.props}
        onLoaded={evt => this.onLoaded(evt, image, gap, dotSize, dotImage)}
        key={`${image}${gap}${dotSize}${color}` /*reload when shader specific stuff changes*/}
      />
    )
  }
}

PointCloud.propTypes = {
  vertices: React.PropTypes.array,
  gap: React.PropTypes.number,
  dotSize: React.PropTypes.number
};

PointCloud.defaultProps = {
};



export default PointCloud;