import { Request, Response } from 'express';
import { CharacterRepository } from '../repositories/CharacterRepository';

export class CharactersController {
  private repository = new CharacterRepository();

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const characters = await this.repository.findAll();
      res.status(200).json({
        success: true,
        data: characters,
      });
    } catch (error) {
      console.error('[CharactersController] Error al obtener personajes:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error al procesar la solicitud de personajes.',
        },
      });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const character = await this.repository.findById(id);

      if (!character) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Personaje con id '${id}' no encontrado.`,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: character,
      });
    } catch (error) {
      console.error('[CharactersController] Error al obtener personaje:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error al procesar la solicitud.',
        },
      });
    }
  };
}
