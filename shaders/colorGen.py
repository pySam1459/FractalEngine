colors = []

V = 1.0
S = 0.75

step = 350//50
for i in range(50):
    H = i*step
    C = V * S
    X = C * (1-abs((H/60) % 2 -1))
    m = V-C

    rp, gp, bp = [(C, X, 0), (X, C, 0), (0, C, X), (0, X, C), (X, 0, C), (C, 0, X)][H//60]
    
    ## rgb = (float(rp+m), float(gp+m), float(bp+m))
    colors.append(f"vec3({rp+m:.5f}, {gp+m:.5f}, {bp+m:.5f}), ")

print(colors)
