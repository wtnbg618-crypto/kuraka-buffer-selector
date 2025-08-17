from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from kub_data import KUB_DATA
from krb_data import KRB_DATA
import math

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SelectionInput(BaseModel):
    buffer_type: str
    num_buffers_N1: int
    num_buffers_N2: int
    collision_pattern: str
    mass: float | None = None
    velocity: float | None = None
    force: float | None = None
    drop_height: float | None = None
    mass_A: float | None = None
    mass_B: float | None = None
    velocity_A: float | None = None
    velocity_B: float | None = None
    force_A: float | None = None
    force_B: float | None = None
    slope_length: float | None = None
    slope_angle: float | None = None

class SelectionOutput(BaseModel):
    selected_model: str
    message: str

@app.post("/select_buffer", response_model=SelectionOutput)
def select_buffer(data: SelectionInput):
    g = 9.80665
    e1 = 0

    # 衝突パターンに応じてエネルギーを計算
    if data.collision_pattern == 'horizontal':
        e1 = 0.5 * data.mass * (data.velocity ** 2)
    elif data.collision_pattern == 'horizontal-relative':
        m_eq = (data.mass_A * data.mass_B) / (data.mass_A + data.mass_B)
        v_eq = data.velocity_A + data.velocity_B
        e1 = 0.5 * m_eq * (v_eq ** 2)
    elif data.collision_pattern == 'vertical':
        e1 = data.mass * g * data.drop_height
    elif data.collision_pattern == 'slope':
        angle_rad = math.radians(data.slope_angle)
        e1 = 0.5 * data.mass * (data.velocity ** 2) + data.mass * g * data.slope_length * math.sin(angle_rad)

    num_buffers_N = data.num_buffers_N1 * data.num_buffers_N2
    if num_buffers_N == 0:
        return {"selected_model": "N/A", "message": "緩衝器の数が0です。"}

    # 緩衝器1個あたりのエネルギー (A1)
    a1 = e1 / num_buffers_N
    # 付加エネルギーはストロークSに依存するため、ここでは0として選定
    a3 = a1

    # buffer_typeに応じてモデル選定
    if data.buffer_type.upper() == 'KUB':
        # KUBの選定ロジック
        # v = 0.5m/sの線を基準とする
        amax = 0.83 # J/cm3
        v_required = (a3 * 1000) / amax # a3はkJなのでJに変換

        selected_kub = None
        for kub in KUB_DATA:
            if kub['Vo'] >= v_required:
                selected_kub = kub
                break

        if selected_kub:
            return {"selected_model": selected_kub['model'], "message": f"選定されたモデルは {selected_kub['model']} です。衝突エネルギー: {e1:.2f} kJ, 必要体積: {v_required:.2f} cm³, 製品体積: {selected_kub['Vo']} cm³"}
        else:
            return {"selected_model": "N/A", "message": "適切なモデルが見つかりませんでした。"}

    elif data.buffer_type.upper() == 'KRB':
        # KRBの選定ロジック
        selected_krb = None
        for krb in KRB_DATA:
            if krb['Amax'] >= a3:
                selected_krb = krb
                break

        if selected_krb:
            return {"selected_model": selected_krb['model'], "message": f"選定されたモデルは {selected_krb['model']} です。衝突エネルギー: {e1:.2f} kJ, 必要吸収エネルギー: {a3:.2f} kJ, 製品の吸収エネルギー能力: {selected_krb['Amax']} kJ"}
        else:
            return {"selected_model": "N/A", "message": "適切なモデルが見つかりませんでした。"}

    return {"selected_model": "N/A", "message": "無効なバッファータイプです。"}

@app.get("/")
def read_root():
    return {"message": "Kurashiki Kako Buffer Selector API"}