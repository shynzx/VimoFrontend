import { Request, Response } from 'express';
import { CardRepository } from '../repositories/CardRepository';

export class CardsController {
  private repository = new CardRepository();

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 20);
      if (!Number.isSafeInteger(page) || page < 1 || page > 1000000 ||
          !Number.isSafeInteger(limit) || limit < 1 || limit > 100 ||
          (req.query.q !== undefined && (typeof req.query.q !== 'string' || req.query.q.length > 200)) ||
          (req.query.type !== undefined && (typeof req.query.type !== 'string' || req.query.type.length > 64))) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Parámetros de búsqueda o paginación inválidos.' } });
        return;
      }
      const query = typeof req.query.q === 'string' ? req.query.q : undefined;
      const type = typeof req.query.type === 'string' ? req.query.type : undefined;

      const { cards, total } = await this.repository.findAll({
        query,
        type,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: cards,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    } catch (error) {
      console.error('[CardsController] Error al obtener cartas:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error al procesar la solicitud de cartas.',
        },
      });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const card = await this.repository.findById(id);

      if (!card) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Carta con id '${id}' no encontrada.`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: card,
      });
    } catch (error) {
      console.error('[CardsController] Error al obtener carta por id:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error al procesar la solicitud de la carta.',
        },
      });
    }
  };
}
