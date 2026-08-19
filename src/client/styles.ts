/** Plugin-owned global and settings-card styles. */
export const STYLE = `
body[data-dsh-liquid-glass] {
  min-height: 100vh;
  background-color: #10141d;
  background-image:
    linear-gradient(rgba(5, 8, 14, var(--dsh-lg-dim)), rgba(5, 8, 14, var(--dsh-lg-dim))),
    var(--dsh-lg-image),
    linear-gradient(135deg, #1b2740, #10141d 58%, #261b36);
  background-position: center, var(--dsh-lg-position), center;
  background-size: cover, var(--dsh-lg-size), cover;
  background-repeat: no-repeat;
  background-attachment: scroll;
}

body[data-dsh-liquid-glass] :where([role="dialog"], [role="menu"], [role="listbox"]) {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 18px 50px rgba(0, 0, 0, 0.2);
}

.dsh-lg-card {
  list-style: none;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 16px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
}

.dsh-lg-head {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.dsh-lg-title { display: block; font-size: 16px; font-weight: 650; }
.dsh-lg-desc { display: block; margin-top: 5px; color: var(--dsw-alias-label-secondary); font-size: 13px; }
.dsh-lg-body { display: grid; gap: 18px; padding: 20px; border-top: 1px solid var(--dsw-alias-border-l1); }
.dsh-lg-switch { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.dsh-lg-field { display: grid; gap: 7px; }
.dsh-lg-section { display: grid; gap: 14px; padding: 16px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px; }
.dsh-lg-label-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.dsh-lg-label { font-size: 14px; font-weight: 600; }
.dsh-lg-value, .dsh-lg-hint, .dsh-lg-status { color: var(--dsw-alias-label-secondary); font-size: 12px; }
.dsh-lg-input {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-specific-input-major);
  color: inherit;
}
.dsh-lg-range { width: 100%; accent-color: var(--dsw-alias-state-business-primary); }
.dsh-lg-upload { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.dsh-lg-file { max-width: 100%; font-size: 13px; }
.dsh-lg-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
.dsh-lg-buttons { display: flex; gap: 8px; }
.dsh-lg-btn {
  padding: 9px 15px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-button-elevated-fill);
  color: inherit;
  cursor: pointer;
}
.dsh-lg-btn-primary { border-color: transparent; background: var(--dsw-alias-button-info-fill); color: #fff; }
.dsh-lg-btn:disabled { opacity: .55; cursor: default; }
.dsh-lg-preview {
  min-height: 104px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.32);
  border-radius: 16px;
  background-image:
    linear-gradient(rgba(5,8,14,.15), rgba(5,8,14,.15)),
    var(--dsh-lg-preview-image),
    linear-gradient(135deg, #78a7ff, #d08cff 52%, #59d9c2);
  background-position: center, var(--dsh-lg-preview-position), center;
  background-size: cover, var(--dsh-lg-preview-size), cover;
  background-repeat: no-repeat;
}
.dsh-lg-preview-glass {
  width: 58%;
  margin: 18px;
  padding: 14px;
  border: 1px solid rgba(255,255,255,.4);
  border-radius: 14px;
  background:
    linear-gradient(135deg, rgba(255,255,255,.16), rgba(255,255,255,.04)),
    rgba(255,255,255,var(--dsh-lg-preview-opacity));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.28), 0 10px 30px rgba(0,0,0,.16);
  color: #10141d;
  font-size: 13px;
  font-weight: 650;
}
`
