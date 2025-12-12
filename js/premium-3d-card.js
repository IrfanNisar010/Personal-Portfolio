document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.premium-3d-card');

  cards.forEach(card => {
    // State for smooth animation
    let bounds;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let mouseLeaveDelay;
    let isHovering = false;

    const updateBounds = () => {
      bounds = card.getBoundingClientRect();
    };
    
    // Initial bounds
    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds); // Update on scroll too

    // Animation loop for smooth follow (Lerp)
    const animate = () => {
      if (!bounds) return;

      // Linear Interpolation (Lerp) for smoothness
      // 0.1 = speed (lower is smoother/slower, higher is more responsive)
      const ease = 0.08; 
      
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      
      currentX += dx * ease;
      currentY += dy * ease;

      // Calculate rotation based on SMOOTHED position
      // Position relative to center
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      
      // Calculate rotation (max 3 degrees)
      // Note: currentX/Y are relative to the *card top-left*
      const rotateX = ((currentY - centerY) / centerY) * -3; 
      const rotateY = ((currentX - centerX) / centerX) * 3;

      // Apply transforms
      // Only apply if hovering or if there's still significant movement transitioning back
      if (isHovering || Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        card.style.setProperty('--mouse-x', `${currentX}px`);
        card.style.setProperty('--mouse-y', `${currentY}px`);
        
        if (isHovering) {
             card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        } else {
             // Smoothly return to 0 rotation on leave
             card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        }
      }

      requestAnimationFrame(animate);
    };

    // Start loop
    animate();

    card.addEventListener('mouseenter', () => {
      isHovering = true;
      clearTimeout(mouseLeaveDelay);
      updateBounds(); // Ensure bounds are fresh
    });

    card.addEventListener('mousemove', (e) => {
      // Just update target mouse position
      // Subtract rect.left/top to get local coordinates
      mouseX = e.clientX - bounds.left;
      mouseY = e.clientY - bounds.top;
    });

    card.addEventListener('mouseleave', () => {
      isHovering = false;
      // Reset target to center so it floats back to middle or just stays? 
      // Usually better to let it drift to last position or center. 
      // Let's set target to center for the tilt resets naturally via the 'if(isHovering)' check above?
      // Actually, for the spotlight, we want it to stay where it left or fade out. 
      // The CSS handles fade out opacity.
      // We just stop the tilt. 
    });
  });
});
