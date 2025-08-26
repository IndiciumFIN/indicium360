from flask_sqlalchemy import SQLAlchemy
from src.models.user import db
from datetime import datetime

class DemonstracaoFinanceira(db.Model):
    __tablename__ = 'demonstracao_financeira'
    
    id = db.Column(db.Integer, primary_key=True)
    tipo_demonstracao = db.Column(db.String(50), nullable=False)  # BP, DRE, DRA, DMPL, DFC, DVA
    periodo = db.Column(db.String(7), nullable=False)  # YYYY-MM
    versao_balancete = db.Column(db.String(50), default='1.0')
    versao_plano_contas = db.Column(db.String(50), default='1.0')
    dados_json = db.Column(db.Text, nullable=False)  # JSON com os dados da demonstração
    data_geracao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<DemonstracaoFinanceira {self.tipo_demonstracao} - {self.periodo}>'
    
    def to_dict(self):
        import json
        return {
            'id': self.id,
            'tipo_demonstracao': self.tipo_demonstracao,
            'periodo': self.periodo,
            'versao_balancete': self.versao_balancete,
            'versao_plano_contas': self.versao_plano_contas,
            'dados': json.loads(self.dados_json) if self.dados_json else {},
            'data_geracao': self.data_geracao.isoformat() if self.data_geracao else None
        }
    
    @classmethod
    def get_demonstracao(cls, tipo_demonstracao, periodo, versao_balancete='1.0'):
        return cls.query.filter_by(
            tipo_demonstracao=tipo_demonstracao,
            periodo=periodo,
            versao_balancete=versao_balancete
        ).first()

class NotaExplicativa(db.Model):
    __tablename__ = 'nota_explicativa'
    
    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.Integer, nullable=False)
    titulo = db.Column(db.String(255), nullable=False)
    conteudo = db.Column(db.Text, nullable=False)
    periodo = db.Column(db.String(7), nullable=False)  # YYYY-MM
    eh_obrigatoria = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<NotaExplicativa {self.numero} - {self.titulo}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'numero': self.numero,
            'titulo': self.titulo,
            'conteudo': self.conteudo,
            'periodo': self.periodo,
            'eh_obrigatoria': self.eh_obrigatoria,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }
    
    @classmethod
    def get_notas_periodo(cls, periodo):
        return cls.query.filter_by(periodo=periodo).order_by(cls.numero).all()

