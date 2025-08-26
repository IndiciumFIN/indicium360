from flask_sqlalchemy import SQLAlchemy
from src.models.user import db
from datetime import datetime

class PlanoContas(db.Model):
    __tablename__ = 'plano_contas'
    
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(20), nullable=False, index=True)
    nome = db.Column(db.String(255), nullable=False)
    tipo_conta = db.Column(db.String(50), nullable=False)  # patrimonial, resultado, transitoria
    elemento_conta = db.Column(db.String(50), nullable=False)  # ativo, passivo, pl, receita, custo, despesa
    nivel = db.Column(db.Integer, nullable=False)  # 1 a 5
    conta_pai_id = db.Column(db.Integer, db.ForeignKey('plano_contas.id'), nullable=True)
    eh_analitica = db.Column(db.Boolean, default=False)  # True para analítica, False para sintética
    versao = db.Column(db.String(50), default='1.0')
    ativo = db.Column(db.Boolean, default=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    conta_pai = db.relationship('PlanoContas', remote_side=[id], backref='contas_filhas')
    
    def __repr__(self):
        return f'<PlanoContas {self.codigo} - {self.nome}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'codigo': self.codigo,
            'nome': self.nome,
            'tipo_conta': self.tipo_conta,
            'elemento_conta': self.elemento_conta,
            'nivel': self.nivel,
            'conta_pai_id': self.conta_pai_id,
            'eh_analitica': self.eh_analitica,
            'versao': self.versao,
            'ativo': self.ativo,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None
        }
    
    @classmethod
    def get_by_codigo(cls, codigo, versao='1.0'):
        return cls.query.filter_by(codigo=codigo, versao=versao, ativo=True).first()
    
    @classmethod
    def get_contas_analiticas(cls, versao='1.0'):
        return cls.query.filter_by(eh_analitica=True, versao=versao, ativo=True).all()
    
    @classmethod
    def get_contas_por_elemento(cls, elemento_conta, versao='1.0'):
        return cls.query.filter_by(elemento_conta=elemento_conta, versao=versao, ativo=True).all()

