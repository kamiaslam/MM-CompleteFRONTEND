export default function sketch(p) {
    let r;
    
    // Default parameters updated via props.
    p.myParams = {
      bump: 0,
      theta: 0,
      phy: 0,
      showSliders: true
    };

    p.setup = function() {
      const container = p.select('#p5-container');
      const w = container?.elt.clientWidth || 400;
      const h = container?.elt.clientHeight || 400;
      p.createCanvas(w, h, p.WEBGL);
      p.angleMode(p.DEGREES);
      p.colorMode(p.RGB); // Using RGB for better color blending
      p.strokeWeight(2);
      p.noFill();
      r = p.width / 3;
    };

    p.draw = function() {
      p.clear();
      p.orbitControl(4, 4);
      p.rotateX(65);
      
      // Use the animated values from props.
      const bump = p.myParams.bump;
      const thetaVal = p.myParams.theta;
      const phyVal = p.myParams.phy;
      
      // Define the colors
      const color1 = p.color(255, 0, 249); // #ff00f9
      const color2 = p.color(255, 0, 255); // #ff00ff
      
      p.beginShape(p.POINTS);
      for (let theta = 0; theta < 180; theta += 2) {
        for (let phy = 0; phy < 360; phy += 2) {
          const factor = 1 + bump * p.sin(thetaVal * theta) * p.sin(phyVal * phy);
          const x = r * factor * p.sin(theta) * p.cos(phy);
          const y = r * factor * p.sin(theta) * p.sin(phy);
          const z = r * factor * p.cos(theta);

          // Interpolating colors based on the theta and phy angles
          const interColor = p.lerpColor(color1, color2, theta / 180);
          p.stroke(interColor);

          p.vertex(x, y, z);
        }
      }
      p.endShape();
    };

    p.windowResized = function() {
      const container = p.select('#p5-container');
      if (container) {
        const w = container.elt.clientWidth;
        const h = container.elt.clientHeight;
        p.resizeCanvas(w, h);
        r = p.width / 3;
      }
    };

    // Called automatically when props change.
    p.updateWithProps = function(props) {
      if (props.params) {
        p.myParams = { ...p.myParams, ...props.params };
      }
    };
}
