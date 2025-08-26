from flask_sqlalchemy import SQLAlchemy
from src.models.user import db
from datetime import datetime

class Balancete(db.Model):
    __tablename__ = 'balancete'
    
    id = db.Column(db.Integer, primary_key=True)
    codigo_conta = db.Column(db.String(20), nullable=False, index=True)
    nome_conta = db.Column(db.String(255), nullable=False)
    saldo_inicial = db.Column(db.Numeric(15, 2), default=0.00)
    debitos = db.Column(db.Numeric(15, 2), default=0.00)
    creditos = db.Column(db.Numeric(15, 2), default=0.00)
    saldo_final = db.Column(db.Numeric(15, 2), default=0.00)
    periodo = db.Column(db.String(7), nullable=False)  # YYYY-MM
    versao_balancete = db.Column(db.String(50), default='1.0')
    versao_plano_contas = db.Column(db.String(50), default='1.0')
    data_importacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento com plano de contas
    plano_contas_id = db.Column(db.Integer, db.ForeignKey('plano_contas.id'), nullable=True)
    plano_contas = db.relationship('PlanoContas', backref='balancetes')
    
    def __repr__(self):
        return f'<Balancete {self.codigo_conta} - {self.periodo}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'codigo_conta': self.codigo_conta,
            'nome_conta': self.nome_conta,
            'saldo_inicial': float(self.saldo_inicial) if self.saldo_inicial else 0.0,
            'debitos': float(self.debitos) if self.debitos else 0.0,
            'creditos': float(self.creditos) if self.creditos else 0.0,
            'saldo_final': float(self.saldo_final) if self.saldo_final else 0.0,
            'periodo': self.periodo,
            'versao_balancete': self.versao_balancete,
            'versao_plano_contas': self.versao_plano_contas,
            'data_importacao': self.data_importacao.isoformat() if self.data_importacao else None,
            'plano_contas_id': self.plano_contas_id
        }
    
    @classmethod
    def get_by_periodo(cls, periodo, versao_balancete='1.0'):
        return cls.query.filter_by(periodo=periodo, versao_balancete=versao_balancete).all()
    
    @classmethod
    def get_saldo_por_conta(cls, codigo_conta, periodo, versao_balancete='1.0'):
        balancete = cls.query.filter_by(
            codigo_conta=codigo_conta, 
            periodo=periodo, 
            versao_balancete=versao_balancete
        ).first()
        return float(balancete.saldo_final) if balancete and balancete.saldo_final else 0.0
    
    @classmethod
    def verificar_totalizador_zero(cls, periodo, versao_balancete='1.0'):
        """Verifica se o somatório de todos os saldos finais é zero"""
        balancetes = cls.get_by_periodo(periodo, versao_balancete)
        total = sum(float(b.saldo_final) if b.saldo_final else 0.0 for b in balancetes)
        return abs(total) < 0.01  # Tolerância para arredondamentos

